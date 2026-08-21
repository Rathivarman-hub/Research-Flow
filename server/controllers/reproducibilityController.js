import fs from 'fs';
import Project from '../models/Project.js';
import Report from '../models/Report.js';


// @desc    Analyze uploaded environment / dependency files for reproducibility rating
// @route   POST /api/reproducibility/check/:projectId
// @access  Private
const checkReproducibility = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      if (req.files) {
        req.files.forEach(f => fs.unlinkSync(f.path));
      }
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let reportDetails = {
      dockerFilePresent: false,
      packageJsonPresent: false,
      requirementsTxtPresent: false,
      envExamplePresent: false,
      unversionedDependencies: [],
      missingEnvDeclarations: [],
      conflictingVersions: [],
      suggestions: []
    };

    let score = 100;

    // Handle files if uploaded
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const content = fs.readFileSync(file.path, 'utf8');
        const filename = file.originalname.toLowerCase();

        if (filename.includes('dockerfile')) {
          reportDetails.dockerFilePresent = true;
          // Check for Docker best practices
          if (!content.includes('FROM')) {
            reportDetails.suggestions.push('Dockerfile is missing "FROM" base image declaration.');
            score -= 15;
          }
          if (!content.includes('WORKDIR')) {
            reportDetails.suggestions.push('Recommended practice: Declare "WORKDIR" in Dockerfile to keep container filesystem isolated.');
            score -= 5;
          }
        } 
        
        else if (filename.includes('package.json')) {
          reportDetails.packageJsonPresent = true;
          try {
            const pkg = JSON.parse(content);
            const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            
            Object.entries(deps).forEach(([depName, version]) => {
              if (version.startsWith('^') || version.startsWith('~') || version === 'latest' || version === '*') {
                reportDetails.unversionedDependencies.push({ name: depName, version, type: 'NPM' });
              }
            });

            if (reportDetails.unversionedDependencies.length > 0) {
              reportDetails.suggestions.push(`Pin NPM dependency versions (e.g. change "^1.2.0" to "1.2.0") to lock environment builds.`);
              score -= Math.min(reportDetails.unversionedDependencies.length * 4, 15);
            }
          } catch (e) {
            reportDetails.suggestions.push('package.json JSON structure is corrupted.');
            score -= 10;
          }
        } 
        
        else if (filename.includes('requirements.txt')) {
          reportDetails.requirementsTxtPresent = true;
          const lines = content.split('\n');
          
          lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              // Check if pinned (has ==)
              if (!trimmed.includes('==') && !trimmed.includes('<=') && !trimmed.includes('>=')) {
                reportDetails.unversionedDependencies.push({ name: trimmed, version: 'any', type: 'Pip' });
              }
              // Incompatibility checks (mock library rules)
              if (trimmed.includes('tensorflow') && trimmed.includes('==1.')) {
                reportDetails.conflictingVersions.push('Tensorflow 1.x is obsolete. Standardize codebase on Tensorflow 2.x for modern runtimes.');
                score -= 10;
              }
            }
          });

          if (reportDetails.unversionedDependencies.length > 0) {
            reportDetails.suggestions.push('Pin Python library requirements using exact versions (e.g., pandas==2.1.0 instead of just pandas).');
            score -= Math.min(reportDetails.unversionedDependencies.length * 4, 15);
          }
        } 
        
        else if (filename.includes('.env')) {
          reportDetails.envExamplePresent = true;
          const lines = content.split('\n');
          lines.forEach(line => {
            if (line.includes('=')) {
              const [key, value] = line.split('=');
              // Warn if credentials are committed
              if (value && value.trim() !== '' && (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('password'))) {
                reportDetails.suggestions.push(`Warning: Sensitive parameter "${key.trim()}" has exposed secrets in environment file.`);
                score -= 10;
              }
            }
          });
        }

        // Delete temp uploaded file
        fs.unlinkSync(file.path);
      });
    } else {
      // Mock validation details for demonstration/sandbox dashboard
      reportDetails.dockerFilePresent = Math.random() > 0.5;
      reportDetails.packageJsonPresent = project.domain.toLowerCase().includes('node') || project.domain.toLowerCase().includes('javascript');
      reportDetails.requirementsTxtPresent = !reportDetails.packageJsonPresent;
      reportDetails.envExamplePresent = Math.random() > 0.3;

      if (!reportDetails.dockerFilePresent) {
        reportDetails.suggestions.push('Missing Dockerfile. Packaging your execution environment into a container ensures reproducibility across hosts.');
        score -= 20;
      }
      if (Math.random() > 0.5) {
        reportDetails.unversionedDependencies.push({ name: 'numpy', version: 'any', type: 'Pip' });
        reportDetails.unversionedDependencies.push({ name: 'pandas', version: 'any', type: 'Pip' });
        reportDetails.suggestions.push('Some Python packages in requirements.txt do not have explicit version requirements pinned. Use exact specifiers (==).');
        score -= 10;
      }
      if (!reportDetails.envExamplePresent) {
        reportDetails.suggestions.push('No .env or .env.example file discovered. Make sure setup instructions define necessary variables.');
        score -= 10;
      }
    }

    // Baseline minimum
    score = Math.max(score, 10);

    let rating = 'Medium';
    if (score >= 85) rating = 'High';
    else if (score < 50) rating = 'Low';

    const report = await Report.create({
      project: projectId,
      type: 'Reproducibility',
      overallScore: score,
      reproducibilityReport: {
        dockerFilePresent: reportDetails.dockerFilePresent,
        packageJsonPresent: reportDetails.packageJsonPresent,
        requirementsTxtPresent: reportDetails.requirementsTxtPresent,
        envExamplePresent: reportDetails.envExamplePresent,
        unversionedDependencies: reportDetails.unversionedDependencies,
        missingEnvDeclarations: reportDetails.missingEnvDeclarations,
        conflictingVersions: reportDetails.conflictingVersions,
        suggestions: reportDetails.suggestions,
        readinessRating: rating,
      },
    });

    res.json({
      success: true,
      message: 'Reproducibility check completed successfully',
      data: report,
    });

  } catch (error) {
    if (req.files) {
      req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reproducibility history for project
// @route   GET /api/reproducibility/project/:projectId
// @access  Private
const getReproducibilityByProject = async (req, res) => {
  try {
    const reports = await Report.find({ project: req.params.projectId, type: 'Reproducibility' })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  checkReproducibility,
  getReproducibilityByProject,
};

