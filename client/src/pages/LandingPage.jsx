import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Award, GitBranch, Terminal, Users, Play } from 'lucide-react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export default function LandingPage() {
  return (
    <div className="fade-in-slide py-5" style={{ background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent)' }}>
      {/* Hero Section */}
      <Container className="text-center py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-primary-subtle text-primary border border-primary-subtle mb-4">
              <Award size={16} />
              <span className="fw-semibold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>REVOLUTIONIZING RESEARCH SOFTWARE DEVELOPMENT</span>
            </div>
            <h1 className="display-3 fw-bold font-display tracking-tight mb-4 text-gradient">
              Bridge the Gap Between <br />
              <span className="text-primary">Research & Engineering</span>
            </h1>
            <p className="lead text-muted fs-5 mb-5">
              ResearchFlow AI is your Research Software Engineering (RSE) companion. Adopt code modularity, automate test structures, check environments for reproducibility, and get mentored by AI.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/register" className="btn-glow-primary px-4 py-2.5 fw-semibold d-flex align-items-center gap-2">
                Get Started Free
              </Button>
              <Button as={Link} to="/login" variant="outline-secondary" className="px-4 py-2.5 fw-semibold d-flex align-items-center gap-2">
                <Play size={16} />
                <span>Log In</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features Grid */}
      <Container className="py-5 my-4">
        <div className="text-center mb-5">
          <h2 className="display-5 font-display fw-bold">Platform Capabilities</h2>
          <p className="text-muted">A standard suite of tools built specifically for scientific computing and software lifecycle management.</p>
        </div>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-primary-subtle text-primary rounded-3 d-inline-block mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">Readiness Assessments</h4>
                <p className="text-muted small">
                  Evaluate documentation, unit tests, commit frequency, and cooperation structures to determine RSE maturity index metrics.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-success-subtle text-success rounded-3 d-inline-block mb-3">
                  <Terminal size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">Reproducibility Checker</h4>
                <p className="text-muted small">
                  Audit package manifests, lock files, environment variables, and Docker containerizations to eliminate runtime conflicts.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-warning-subtle text-warning rounded-3 d-inline-block mb-3">
                  <MessageSquare size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">AI RSE Mentor</h4>
                <p className="text-muted small">
                  A chatbot built to explain container deployment, git strategies, branch standards, and automated unit testing steps.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-info-subtle text-info rounded-3 d-inline-block mb-3">
                  <GitBranch size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">GitHub Integration</h4>
                <p className="text-muted small">
                  Import projects, pull recent commits histories, evaluate contributor shares, and monitor open issues statistics.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-danger-subtle text-danger rounded-3 d-inline-block mb-3">
                  <Users size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">Workspace Sprints</h4>
                <p className="text-muted small">
                  Track project workflows via responsive Kanban boards, discuss iterations with inline commenting, and assign roles.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="glass-card h-100 p-4 border-0">
              <Card.Body className="p-0">
                <div className="p-3 bg-secondary-subtle text-secondary rounded-3 d-inline-block mb-3">
                  <Award size={24} />
                </div>
                <h4 className="font-display fw-bold mb-2">Maturity Model Badges</h4>
                <p className="text-muted small">
                  Progress through Bronze, Silver, Gold, and Platinum achievements. Download official certificates of RSE quality.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to action */}
      <Container className="text-center py-5">
        <div className="glass-card p-5 border-0 bg-primary-subtle text-primary-emphasis position-relative overflow-hidden">
          <h3 className="display-6 font-display fw-bold mb-3">Ready to structure your scientific software?</h3>
          <p className="mb-4">Begin tracking environment states and documenting computational processes today.</p>
          <Button as={Link} to="/register" className="btn-glow-primary px-4 py-2 fw-semibold">
            Create Free Account
          </Button>
        </div>
      </Container>
    </div>
  );
}
