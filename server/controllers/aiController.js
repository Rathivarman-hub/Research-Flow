import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
import Project from '../models/Project.js';


// Initialize Gemini API (safely)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err.message);
  }
}

// Smart local fallback generator for documentation
const generateLocalDocs = (project, docType) => {
  const { name, description, domain, researchObjectives } = project;
  const objectivesStr = researchObjectives.map(obj => `- ${obj}`).join('\n');

  switch (docType) {
    case 'readme':
      return `# ${name}

## Project Overview
${description}

## Research Domain
This project belongs to the **${domain}** domain. It is designed to address key research challenges and streamline computation pipelines.

## Research Objectives
${objectivesStr || '- Address domain-specific research questions.'}

## Prerequisites
Ensure you have the following installed:
- Python 3.9+ or Node.js 18+ (depending on the run environment)
- Git (for version control)
- Docker (optional, for fully containerized reproducibility)

## Quick Start
1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd ${name.toLowerCase().replace(/\s+/g, '-')}
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   # For Python environments:
   pip install -r requirements.txt
   
   # For Javascript/Node environments:
   npm install
   \`\`\`
3. Run the research scripts:
   \`\`\`bash
   python main.py --run
   # OR
   npm start
   \`\`\`

## License
MIT License - Copyright (c) ${new Date().getFullYear()} ResearchFlow AI Team
`;

    case 'install':
      return `# Installation & Setup Guide - ${name}

This guide provides step-by-step instructions to set up the execution environment for ${name} and reproduce the research pipeline.

## System Requirements
* **Operating System**: Windows 10/11, macOS Big Sur+, or Ubuntu 20.04+
* **RAM**: 8 GB minimum (16 GB recommended for dataset processing)
* **Processor**: Core i5 / AMD Ryzen 5 or higher

## Step 1: Install Core Runtimes
Ensure you have installed the correct compilers/runtimes for **${domain}**.

### Python Environment
Download and install [Python 3.10](https://www.python.org/downloads/). Verify the installation:
\`\`\`bash
python --version
pip --version
\`\`\`

### Node.js Environment
Download and install [Node.js v20 LTS](https://nodejs.org/). Verify:
\`\`\`bash
node -v
npm -v
\`\`\`

## Step 2: Set Up Virtual Environment (Recommended)
Avoid global package dependency conflicts.

### Python venv setup:
\`\`\`bash
python -m venv venv
# On Windows (PowerShell):
.\\venv\\Scripts\\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
\`\`\`

## Step 3: Install Package Dependencies
With the environment active, install:
\`\`\`bash
# Python packages
pip install --upgrade pip
pip install -r requirements.txt

# Node.js packages
npm install
\`\`\`

## Step 4: Environment Variables Setup
Copy \`.env.example\` to \`.env\` and populate variables.
\`\`\`bash
PORT=8000
DATABASE_URL=mongodb://localhost:27017/research_db
DEBUG=True
\`\`\`

## Step 5: Verify Setup
Run tests to verify the setup:
\`\`\`bash
pytest tests/
# OR
npm test
\`\`\`
`;

    case 'api':
      return `# API and CLI Reference Guide - ${name}

This reference documents the public application programming interfaces (APIs) and Command Line Interfaces (CLIs) exported by the ${name} research code.

## Command Line Interface (CLI)
The primary entry script support arguments to configure hyperparameters and run modes.

\`\`\`bash
python run_experiment.py [options]
\`\`\`

### Core CLI Arguments:
| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`--epochs\` | Integer | \`50\` | Number of model training epochs |
| \`--batch-size\` | Integer | \`32\` | Hyperparameter for data batch loader size |
| \`--lr\` | Float | \`0.001\` | Learning rate |
| \`--data\` | String | \`./data/raw\` | Path to dataset directory |
| \`--export\` | Boolean | \`True\` | Flag to save training weights and logs |

## REST API Documentation
If running the simulation web-server, the following REST endpoints are available:

### 1. Get Project Status
* **Endpoint**: \`GET /api/v1/status\`
* **Response**:
  \`\`\`json
  {
    "status": "online",
    "uptime": "3600s",
    "domain": "${domain}"
  }
  \`\`\`

### 2. Submit Experiment Job
* **Endpoint**: \`POST /api/v1/experiment\`
* **Headers**: \`Content-Type: application/json\`
* **Body**:
  \`\`\`json
  {
    "param_set": "alpha",
    "dataset": "genomics_v3.csv",
    "threshold": 0.85
  }
  \`\`\`
* **Response**:
  \`\`\`json
  {
    "job_id": "job_948271",
    "status": "queued",
    "estimated_duration": "45m"
  }
  \`\`\`
`;

    case 'structure':
      return `# Folder Structure & Design Rationale - ${name}

Here is the recommended workspace architecture for the ${name} research project, supporting reproducibility and clean code standards.

\`\`\`
${name.toLowerCase().replace(/\s+/g, '-')}/
├── data/                   # Data directory (ignored in git)
│   ├── raw/                # Original immutable datasets
│   └── processed/          # Cleaned, standardized data files
├── notebooks/              # Jupyter Notebooks for EDA and prototyping
│   └── 1.0-eda-plots.ipynb
├── src/                    # Main source code logic
│   ├── __init__.py
│   ├── data_loader.py      # Custom file loading and pipeline scripts
│   ├── model.py            # Neural architecture/statistical definitions
│   └── utils.py            # Helper scripts and generic tools
├── tests/                  # Unit and integration tests
│   ├── test_data.py
│   └── test_model.py
├── .gitignore              # Files to ignore (credentials, large data)
├── Dockerfile              # Docker recipe for reproducibility
├── README.md               # Quick overview
└── requirements.txt        # Python dependency manifests
\`\`\`

## Directory Explanations
* **data/**: All dataset files must reside here. Never commit large data files to git repositories. Maintain backups in dataset repositories.
* **notebooks/**: Used strictly for exploratory data analysis (EDA). Refactor final models and code into modules in the \`src/\` folder for reproducibility.
* **src/**: Consists of clean, modular files. Functions are isolated, tested, and documented.
`;

    default:
      return `# Documentation - ${name}
This section contains standard RSE information.`;
  }
};

// @desc    Generate AI Documentation
// @route   POST /api/ai/generate-doc/:projectId
// @access  Private
const generateDoc = async (req, res) => {
  const { projectId } = req.params;
  const { docType } = req.body; // 'readme', 'install', 'api', 'structure'

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let generatedText = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are a Research Software Engineer (RSE). Generate high-quality markdown documentation for the following project:
        Project Name: ${project.name}
        Description: ${project.description}
        Domain: ${project.domain}
        Objectives: ${project.researchObjectives.join(', ')}
        
        Specifically generate the following document type: "${docType.toUpperCase()}". Make sure it is detailed, contains typical folders or installation commands for this domain, and maintains standard academic/engineering best practices. Do not include extra conversational text outside the markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        generatedText = response.text();
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back to local templates. Error:', aiErr.message);
        generatedText = generateLocalDocs(project, docType);
      }
    } else {
      // Use local fallback
      generatedText = generateLocalDocs(project, docType);
    }

    res.json({ success: true, data: generatedText });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export generated markdown docs to PDF
// @route   POST /api/ai/export-pdf
// @access  Private
const exportPdf = (req, res) => {
  const { title, content } = req.body;

  try {
    const doc = new PDFDocument({ margin: 50 });

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${title.replace(/\s+/g, '_')}_Docs.pdf"`
    );

    doc.pipe(res);

    // Document Header
    doc.fillColor('#0d6efd').fontSize(26).text(title, { align: 'center' });
    doc.moveDown(1);
    doc.strokeColor('#dee2e6').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Document Content (Clean formatting for text lines)
    doc.fillColor('#212529').fontSize(12).lineGap(4);

    const lines = content.split('\n');
    lines.forEach((line) => {
      // Basic formatting for headers in pdf
      if (line.startsWith('# ')) {
        doc.moveDown(0.5);
        doc.fillColor('#0d6efd').fontSize(18).text(line.replace('# ', ''), { underline: true });
        doc.fillColor('#212529').fontSize(12);
        doc.moveDown(0.5);
      } else if (line.startsWith('## ')) {
        doc.moveDown(0.5);
        doc.fillColor('#495057').fontSize(14).text(line.replace('## ', ''));
        doc.fillColor('#212529').fontSize(12);
        doc.moveDown(0.3);
      } else if (line.startsWith('### ')) {
        doc.moveDown(0.3);
        doc.fillColor('#6c757d').fontSize(12).text(line.replace('### ', ''), { bold: true });
        doc.fillColor('#212529').fontSize(12);
        doc.moveDown(0.2);
      } else if (line.trim() !== '') {
        // Strip out basic markdown code ticks for pdf formatting
        const cleanLine = line.replace(/`/g, '').replace(/\*/g, '');
        doc.text(cleanLine);
      } else {
        doc.moveDown(0.3);
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Mentor Chatbot queries
// @route   POST /api/ai/mentor-chat
// @access  Private
const mentorChat = async (req, res) => {
  const { message, chatHistory } = req.body; // chatHistory format: [{ role: 'user'|'model', parts: [ { text: '...' } ] }]

  try {
    let answerText = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // System instruction template
        const systemInstruction = `You are a senior Research Software Engineer (RSE) mentor assisting research scholars, scientists, and students.
        Explain concepts step-by-step. Prioritize software engineering best practices: version control (Git), modular coding, writing testing suites (pytest, jest), docker containerization, documenting APIs, and reproducibility. Keep answers structured, polite, and technical.`;

        // Format history for Gemini SDK
        const formattedHistory = (chatHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({
          history: formattedHistory,
          systemInstruction: systemInstruction
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        answerText = response.text();
      } catch (aiErr) {
        console.warn('Gemini chat failed, using RSE rules fallback:', aiErr.message);
        answerText = getMockMentorResponse(message);
      }
    } else {
      answerText = getMockMentorResponse(message);
    }

    res.json({ success: true, data: answerText });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper mock mentor response generator
const getMockMentorResponse = (query) => {
  const q = query.toLowerCase();

  if (q.includes('test') || q.includes('pytest') || q.includes('unit test')) {
    return `### How to Write Unit Tests in Research Code
Testing ensures that changes to your research code (e.g. data preprocessors, model configs) do not break the results.

#### Python Example (using Pytest)
1. Install pytest:
   \`\`\`bash
   pip install pytest
   \`\`\`
2. Create a folder named \`tests/\` and add a test file \`tests/test_analysis.py\`:
   \`\`\`python
   import pytest
   # Import the function you want to test
   from src.data_loader import compute_mean
   
   def test_compute_mean():
       data = [1, 2, 3, 4, 5]
       result = compute_mean(data)
       assert result == 3.0
       
   def test_compute_mean_empty():
       with pytest.raises(ValueError):
           compute_mean([])
   \`\`\`
3. Run tests using terminal:
   \`\`\`bash
   pytest
   \`\`\`
   
#### Checklist for Research Testing:
* **Verify Data Preprocessing**: Write tests verifying the shapes of arrays after scaling.
* **Model Sanity Check**: Write tests ensuring that weights update after a single gradient step.
* **Deterministic Outputs**: Run checks with fixed seeds (\`numpy.random.seed(42)\`).`;
  }

  if (q.includes('git') || q.includes('branch') || q.includes('commit')) {
    return `### Using Git Branches and Workflows for Research Projects
Git tracks all research changes. Here is the best-practice RSE git branching flow:

1. **Keep the \`main\` branch clean**: The \`main\` branch should always represent your latest stable publication state. Any code committed here must run end-to-end.
2. **Use \`develop\` branch**: Use this branch for daily experimental builds.
3. **Use Feature Branches**: When writing a new algorithm or adding a dataset parser:
   \`\`\`bash
   git checkout -b feature/data-parser
   \`\`\`
   Do your work, commit details, then merge back via a Pull Request.

#### Commit Message Standard:
Bad: \`git commit -m "fixed code"\`
Good: \`git commit -m "feat(data): add parsing functionality for CSV cell lines"\`
This links changes to specific research features.`;
  }

  if (q.includes('docker') || q.includes('reprodu') || q.includes('container')) {
    return `### Improving Reproducibility with Docker
Docker locks in your OS version, dependencies, libraries, and system configurations so other researchers can run your code exactly as you did.

#### Standard Python Dockerfile
Create a file named \`Dockerfile\` in your project root:
\`\`\`dockerfile
# Use a slim, stable python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies manifest
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code files
COPY src/ ./src
COPY run_pipeline.py .

# Command to execute
ENTRYPOINT ["python", "run_pipeline.py"]
\`\`\`

#### Build & Run Commands:
\`\`\`bash
docker build -t research-pipeline:v1.0 .
docker run --rm research-pipeline:v1.0 --epochs 100
\`\`\`
This guarantees execution regardless of user OS environment constraints.`;
  }

  return `Hello! I am your Research Software Engineering (RSE) mentor. 

I can guide you in adopting industry software development standards to make your scientific research reproducible, robust, and collaborative.

Try asking me questions like:
- **"How do I write unit tests for python?"**
- **"Explain git branches workflows."**
- **"How do I dockerize my research application?"**
- **"How can I improve my project reproducibility rating?"**`;
};

export {
  generateDoc,
  exportPdf,
  mentorChat,
};

