// import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
// import { Alert, AlertTitle } from '@material-ui/lab';
import { BaseURL } from '../Url/BaseURL'
import { UseGlobalState, UseGlobalStateUpdate } from '../../context/context'
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '40ch',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Login() {

    const golobalState = UseGlobalState()
    const globalStateUpdate = UseGlobalStateUpdate()
    console.log("lsdflafljl===============>>>>>>>>>>>>>>>>>... ", golobalState)
    console.log("lsdflafljl===============>>>>>>>>>>>>>>>>>... ", globalStateUpdate)



    const history = useHistory();
    const classes = useStyles();
    // const [alertMessage, setAlertMessage] = useState("")
    function Login(event) {
        event.preventDefault()

        var loginEmail = document.getElementById('loginEmail').value
        var loginPassword = document.getElementById('loginPassword').value

        axios({
            method: 'post',
            url: BaseURL + '/login',
            data: {
                email: loginEmail,
                password: loginPassword
            },
            withCredentials: true
        })
            .then(function (response) {
                if (response.status === 200) {
                    // alert(response.status)
                    console.log("loginRequestUser ====>", response.data.loginRequestUser.role)
                    globalStateUpdate(prev => ({
                        ...prev,

                        loginStatus: true,
                        user: response.data.loginRequestUser,
                        role: response.data.loginRequestUser.role
                    }))
                    alert(response.data.message)
                    if (response.data.loginRequestUser.role === "user") {
                        history.push('/')
                    } else if (response.data.loginRequestUser.role === "admin") {
                        history.push('/admin-home')
                    }
                } else if (response.status === 404) {
                    alert(response.data.message)
                }
            })
            .catch(function (error) {
                if (error.status === 403) {
                    alert(error.message)
                }
            });
        return false;

    }




    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={Login}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="loginEmail"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="loginPassword"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                    </form>
                </div>
                
            </Container>
        </>
    )

}

export default Login;




