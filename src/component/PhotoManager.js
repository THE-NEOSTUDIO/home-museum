import React, {useEffect, useState} from 'react';
import useListPhotoKeys from "../api-hook/useListPhotoKeys";
import {CircularProgress} from "@material-ui/core";
import {ErrorOutlineTwoTone} from "@material-ui/icons";
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";
import Avatar from '@material-ui/core/Avatar';

import Uploader from "./Uploader";

import "../assets/s3-image.css";
import {AmplifyS3Image} from '@aws-amplify/ui-react';

const FixedGrid = function (props) {
    return (
        <Grid
            style={{minHeight: '10vh'}}
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            {props.children}
        </Grid>
    )
}

export default function PhotoManager({id, onSuccess}, ref) {
    const {loading, error, data} = useListPhotoKeys(id);
    const [currentPhotos, setCurrentPhotos] = useState([]);

    if (loading) {
        return (
            <FixedGrid>
                <CircularProgress color="primary"/>
            </FixedGrid>
        )
    }
    if (error) {
        return (
            <FixedGrid>
                <ErrorOutlineTwoTone/>
                <p>Ops... Error happened!</p>
                <p>{error.message}</p>
            </FixedGrid>
        )
    }

    return (
        <div>
            <div>
                <Chip color="primary" avatar={<Avatar>📷</Avatar>}
                      label={`TOTAL IMAGES: ${data.length + currentPhotos.length}`}/>
            </div>
            <div style={{width: '80vw', minHeight: '100px', paddingTop: '10px'}}>
                {
                    data.map(({url}) => (<AmplifyS3Image key={url} imgKey={url}/>))
                }
            </div>
            <div style={{width: '80vw', minHeight: '100px'}}>
                {
                    currentPhotos.map(({key}) => (<AmplifyS3Image key={key} imgKey={key}/>))
                }
            </div>
            <div>
                <Uploader
                    id={id}
                    index={data.length}
                    onSuccess={(result) => setCurrentPhotos([...currentPhotos, ...result]) || onSuccess(result)}
                />
            </div>
        </div>
    )
}