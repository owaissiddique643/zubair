
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { BaseURL } from '../Url/BaseURL'
import { UseGlobalState, UseGlobalStateUpdate } from '../../context/context'

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';



import axios from 'axios'
import { useHistory } from 'react-router-dom';


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




function SignUp() {

    const setGlobalState = UseGlobalStateUpdate()
    const globalState = UseGlobalState();
    let history = useHistory()
    const classes = useStyles();

    function signup(event) {
        event.preventDefault()

        console.log('clicked')
        var userName = document.getElementById('name').value
        var userEmail = document.getElementById('email').value.toLowerCase()
        var userPhone = document.getElementById('phone').value
        var userPassword = document.getElementById('password').value

        // console.log(userEmail)
        var userData = {
            userName: userName,
            userEmail: userEmail,
            userPhone: userPhone,
            userPassword: userPassword
        }
        console.log(userData)
        axios({
            method: 'post',
            url: BaseURL + '/signup',
            data: userData,
            withCredentials: true

        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 200) {
                    alert(response.data.message)
                    console.log(response.data)
                    history.push('/login')
                } else {
                    alert(response.data.message)
                    console.log(response.data)
                }
            })
            .catch(function (error) {
                alert(error)

            });

        document.getElementById("name").value = ""
        document.getElementById("email").value = ""
        document.getElementById("phone").value = ""
        document.getElementById("password").value = ""

        return false;
    }

    return (
        <>
            {/* <Container maxWidth="sm">
                <h1 style={{ display: "inline", marginLeft: 100 }}>SignUp Now</h1>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={signup}>
                    <TextField id="name" label="Name" variant="outlined" /> <br />
                    <TextField id="phone" label="Phone" variant="outlined" /> <br />
                    <TextField id="email" label="Email" variant="outlined" /> <br />
                    <TextField id="password" label="Password" variant="outlined" /><br />
                    <Button type="submit" variant="contained" color="secondary" >
                        Sign Up
                    </Button>
                </form>
            </Container> */}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={signup}>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            autoFocus
                        />
                        <TextField
                        id="phone"
                        label="Phone"
                        variant="outlined" 
                        margin="normal"
                        required
                        fullWidth
                        autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
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
                            id="password"
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


export default SignUp;
