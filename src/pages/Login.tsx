import { Button, Paper, TextField, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import useField from '../hooks/useField';
import usePageTitle from '../hooks/usePageTitle';
import { googleSignInWithPopup, signIn, signUp } from '../utils/firebase';

const Login = () => {
	usePageTitle('Login');
	const navigate = useNavigate();
	const theme = useTheme();

	const [isSignUp, setSignUp] = useState(false);
	const [isGoogleSignIn, setGoogleSignIn] = useState(false);

	const [email, usernameProps] = useField('email', true);
	const [password, passwordProps] = useField('password', true);

	const [submitError, setSubmitError] = useState<string>();

	return (
		<Paper
			component="form"
			onSubmit={async (e: FormEvent) => {
				e.preventDefault();
				try {
					if (isGoogleSignIn) {
						await googleSignInWithPopup();
					} else {
						isSignUp
							? await signUp(email, password)
							: await signIn(email, password);
					}
					navigate('/');
				} catch (err) {
					setSubmitError(
						(err as { message?: string })?.message ?? 'Unknown error occurred'
					);
				}
			}}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				p: 4,
				gap: 2,
				background: theme.palette.backgroundLight
			}}
		>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				Sign in
			</Typography>
			<TextField label="Email" {...usernameProps} type="email" />
			<TextField label="Password" {...passwordProps} type="password" />
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					alignItems: 'center',
					alignSelf: 'flex-end',
					mt: 2
				}}
			>
				{submitError && (
					<Typography
						variant="caption"
						textAlign="right"
						sx={{ color: 'error.main' }}
					>
						{submitError}
					</Typography>
				)}
				<Button
					type="submit"
					variant="outlined"
					onClick={() => setSignUp(true)}
				>
					Sign in
				</Button>
				<Button type="submit" variant="contained">
					Sign up
				</Button>
				<Button
					type="submit"
					variant="contained"
					onClick={() => setGoogleSignIn(true)}
				>
					Google sign-in
				</Button>
			</Box>
		</Paper>
	);
};

export default Login;
