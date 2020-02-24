import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {Link} from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';
const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
    }
}


class Tweet extends Component {
    render() {
        dayjs.extend(relativeTime);
        // Add body,createAt, userImage, userhandle, screamId, likecount, commentCount
        const { classes, tweet: { Tweet, username, Hashtags, Date}} = this.props
        return (
            <Card className={classes.card}>
                <CardMedia title="Profile Image" />
                <CardContent className={classes.content}>
                   <Typography variant="h5" component={Link} to={`/users/${username}`}>{username}</Typography>
                   <Typography variant="body2" color="textSecondary">{dayjs(Date).fromNow()}</Typography>
                    <Typography variant="body1">{Tweet}</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Tweet);
