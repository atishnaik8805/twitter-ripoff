import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Tweet from '../Components/Tweet';

class home extends Component {
    state = {
        tweets: null
    }
    componentDidMount() {
        axios.get('http://localhost:3000/tweet/list')
        .then(res => {
            console.log(res.data)
            this.setState({
                tweets: res.data
            })
        })
        .catch(err => console.log(err));
    }
    render() {
        let recentTweetMarkup = this.state.tweets ? (
        //console.log(this.state.tweets.)
        this.state.tweets.map((tweet,i) => <Tweet key={i} tweet={tweet}/>)
        ) : <p>Loading ...</p>
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                   {recentTweetMarkup}
               </Grid>
               <Grid item sm={4} xs={12}>
                   <p>...Profile</p>
               </Grid>
            </Grid>
        );
    }
}

export default home;
