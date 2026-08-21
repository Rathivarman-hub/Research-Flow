import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';

export default function Login() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      return setLocalError('Please fill in all fields');
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container className="auth-shell fade-in-slide d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} lg={10} xl={9}>
          <Card className="auth-card border-0 overflow-hidden">
            <Row className="g-0">
              <Col lg={5} className="auth-panel d-flex align-items-center justify-content-center">
                <div className="auth-panel-content">
                  <div className="auth-badge">
                    <Sparkles size={14} />
                    ResearchFlow
                  </div>
                  <h1>Welcome back.</h1>
                  <p>
                    Continue your research workflow with AI coaching, project tracking, and team insight in one elegant workspace.
                  </p>

                  <ul className="auth-feature-list">
                    {['Smart project insights', 'Team collaboration', 'Research maturity tracking'].map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>

              <Col lg={7} className="auth-form-panel">
                <div className="auth-form-wrap">
                  <div className="text-center mb-4">
                    <div className="auth-icon-ring">
                      <Sparkles size={22} />
                    </div>
                    <h2>Sign in</h2>
                    <p>Access your workspace and continue building with confidence.</p>
                  </div>

                  {(error || localError) && (
                    <Alert variant="danger" className="auth-alert">
                      <ShieldAlert size={18} />
                      <span>{localError || error}</span>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label>Email address</Form.Label>
                      <div className="input-icon-wrap">
                        <Mail size={18} />
                        <Form.Control
                          type="email"
                          className="auth-input"
                          placeholder="researcher@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="loginPassword">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="mb-0">Password</Form.Label>
                        <span className="auth-mini-link">Forgot password?</span>
                      </div>
                      <div className="input-icon-wrap">
                        <Lock size={18} />
                        <Form.Control
                          type="password"
                          className="auth-input"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Button type="submit" className="auth-primary-btn" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : <><span>Sign in</span><ArrowRight size={18} /></>}
                    </Button>

                    <div className="auth-footer-text">
                      <span>New to ResearchFlow?</span>
                      <Link to="/register">Create an account</Link>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
