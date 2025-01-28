import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { validateUsername, validatePassword, validateEmail } from '../../utils/validation';

interface FormErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        const emailValidation = validateEmail(formData.email);
        const usernameValidation = validateUsername(formData.username);
        const passwordValidation = validatePassword(formData.password);
        const confirmPasswordValidation = 
            formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
                ? { isValid: true }
                : { isValid: false, message: 'Passwords must match' };

        setErrors({
            email: emailValidation.isValid ? undefined : emailValidation.message,
            username: usernameValidation.isValid ? undefined : usernameValidation.message,
            password: passwordValidation.isValid ? undefined : passwordValidation.message,
            confirmPassword: confirmPasswordValidation.isValid ? undefined : confirmPasswordValidation.message
        });

        setFormValid(
            emailValidation.isValid &&
            usernameValidation.isValid &&
            passwordValidation.isValid &&
            confirmPasswordValidation.isValid
        );
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formValid) return;

        const result = await dispatch(registerUser({
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        }));
        
        if (registerUser.fulfilled.match(result)) {
            navigate('/login', { 
                state: { message: 'Registration successful! Please log in.' }
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!formValid || loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Already have an account? Sign In
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
