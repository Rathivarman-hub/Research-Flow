import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldAlert, ArrowRight, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';

export default function Register() {
  const { register, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Researcher');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !email || !password) {
      return setLocalError('Please fill in all fields');
    }
    if (password.length < 6) {
      return setLocalError('Password must be at least 6 characters long');
    }

    setLoading(true);
    const success = await register(username, email, password, role);
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
                    Build better research systems
                  </div>
                  <h1>Create your workspace.</h1>
                  <p>
                    Start tracking maturity, collaborations, and AI-assisted research outcomes from day one.
                  </p>

                  <ul className="auth-feature-list">
                    {['Assess research maturity', 'Collaborate in real time', 'Track progress with confidence'].map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>

              <Col lg={7} className="auth-form-panel">
                <div className="auth-form-wrap auth-register-wrap">
                  <div className="text-center mb-4">
                    <div className="auth-icon-ring">
                      <Briefcase size={22} />
                    </div>
                    <h2>Create account</h2>
                    <p>Set up your research workspace and start optimizing delivery.</p>
                  </div>

                  {(error || localError) && (
                    <Alert variant="danger" className="auth-alert">
                      <ShieldAlert size={18} />
                      <span>{localError || error}</span>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group className="mb-3" controlId="regUsername">
                      <Form.Label>Username</Form.Label>
                      <div className="input-icon-wrap">
                        <User size={18} />
                        <Form.Control
                          type="text"
                          className="auth-input"
                          placeholder="scientist_bob"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="regEmail">
                      <Form.Label>Email address</Form.Label>
                      <div className="input-icon-wrap">
                        <Mail size={18} />
                        <Form.Control
                          type="email"
                          className="auth-input"
                          placeholder="bob@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="regPassword">
                      <Form.Label>Password</Form.Label>
                      <div className="input-icon-wrap">
                        <Lock size={18} />
                        <Form.Control
                          type="password"
                          className="auth-input"
                          placeholder="Create a secure password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="regRole">
                      <Form.Label>Workspace role</Form.Label>
                      <div className="input-icon-wrap select-wrap">
                        <Briefcase size={18} />
                        <Form.Select className="auth-select" value={role} onChange={(e) => setRole(e.target.value)}>
                          <option value="Researcher">Researcher</option>
                          <option value="Team Member">Team Member</option>
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Button type="submit" className="auth-primary-btn register-submit-btn" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : <><span>Register</span><ArrowRight size={18} /></>}
                    </Button>

                    <div className="auth-footer-text">
                      <span>Already have an account?</span>
                      <Link to="/login">Sign in</Link>
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
