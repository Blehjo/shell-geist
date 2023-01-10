import { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { AuthContext } from "../contexts/auth.context";

const SignInForm = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const resetFormFields = () => {
        setEmail('');
        setPassword('');
    }

    const signInWithReact = async () => {
        await axios({
            mode: 'no-cors',
            method: 'post',
            url: `/api/users/login`, 
            data: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true 
        })
    }

    const handleEmailChange = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signInWithReact();
            navigate('/profile')
        } catch(error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    alert('incorrect password for email');
                    break;
                case 'auth/user-not-found':
                    alert('no user associated with this email');
                    break;
                default: 
                    console.log(error);
            }
        }
    }

    return (
        <Row style={{ justifyContent: 'center', color: 'white' }} xs={1}>
            <Col lg={6}>
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <Form onSubmit={handleSubmit} style={{ color: 'white', marginTop: '1rem' }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email"
                        required
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        required 
                        onChange={handlePasswordChange} 
                        name="password" 
                        value={password} 
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="light" type="submit">Sign in</Button>
                    </Col>
                </Row>
            </Form>
            </Col>
        </Row>
    )
}

export default SignInForm;