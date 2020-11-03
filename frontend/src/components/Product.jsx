
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,

    },
    media: {
        height: 140,
    },
    btn: {
        backgroundColor: theme.palette.success
    }


}));


const Product = ({ id, name, description, imageUrl, price }) => {

    const history = useHistory()
    const classes = useStyles();
    const goToDetails = () => {
        history.push(`/product/${id}`)
    }
    return (
        <div className="product_card">
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={imageUrl}
                        title={name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {name}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            {price}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" style={{ minHeight: '5rem' }} component="div">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.btn}>
                    <Button onClick={goToDetails} size="medium" variant="outlined" color="primary" >
                        View Details
            </Button>


                </CardActions>
            </Card>
        </div>


    )
}

export default Product
