import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/download.png';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {connect} from 'react-redux';
import {loginUser} from '../redux/actions/userActions'

import axios from 'axios';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
       margin: '20px auto 20px auto'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem'
    },
    progress: {
        position: 'absolute'
    }
}

class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {}
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('http://localhost:3000/user/login', userData)
        .then(res => {
            console.log(res.data);
            //when you add token
            localStorage.setItem('TweetToken', `TID ${res.data.token}`)
            this.setState({
                loading: false
            });
            this.props.history.push('/');
        })
        .catch(err => {
            console.log('Error ff', err.response.data);
            this.setState({
                errors: err.response.data.errResponse,
                loading: false
            });
            console.log(this.state.errors);
        })
    }
    
    handleChange = (event) => {
          this.setState({
              [event.target.name]: event.target.value
          });       
    }
    render() {
        const { classes } = this.props;
        const { errors, loading} = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <img src={AppIcon} alt='Twitter image' className={classes.image} />
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange} helperText={errors.email} error={errors.email ? true : false} fullWidth />
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange} helperText={errors.password} error={errors.password ? true : false} fullWidth />
                        {errors.general && (<Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" disabled={loading} className={classes.button}>Login {loading && (<CircularProgress size={30} className={classes.progress}></CircularProgress>)}</Button>
                        <br />
                        <small>Dont have an account?  Sign up <Link to="/signup">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        );
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}


export default withStyles(styles)(login);
