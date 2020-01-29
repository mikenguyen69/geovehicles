import React, {useState, useEffect, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';

// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';

const INITIAL_VIEWPORT  = {
  latitude: -36.8484597,
  longitude: 174.7633315,
  zoom: 13
}

const Map = ({ classes }) => {
  const {state, dispatch} = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState({latitude: -36.8484597, longitude: 174.7633315});
  const [popup, setPopup] = useState(null);


  useEffect(() => {
    getUserPosition()
  },[]);

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        
        setViewport({...viewport, latitude, longitude});
        setUserPosition({latitude, longitude});

        console.log(position.coords);
        console.log(userPosition);

      });
    }
  }

  const handleMapClick = ({lngLat, leftButton}) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({type: "CREATE_DRAFT"})
    }

    const [longitude, latitude] = lngLat;

    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {longitude, latitude}
    });
  }

  return (
  <div className={classes.root}>
    <ReactMapGL
      width="100vw"
      height="calc(100vh - 64px)" 
      mapStyle="mapbox://styles/mapbox/streets-v9" 
      mapboxApiAccessToken="pk.eyJ1IjoibWlrZW5ndXllbiIsImEiOiJjazV4OWsyb24yM29pM21vbm1iOWczcWVuIn0.-bnGQr4bUUFasXDdcRqpZw" 
      onClick={handleMapClick}
      onViewStateChange={newViewport => setViewport(newViewport)}
      {...viewport}
    >
      {/* Naviation control*/}
      <div className={classes.navigationControl}>
        <NavigationControl onViewStateChange={newViewport => setViewport(newViewport)} />
      </div>

      {/* For current user location */}
      {userPosition && (
        <>
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
            >
            <PinIcon size={40} color="red" />
          </Marker>
          <Marker
            latitude={userPosition.latitude - 0.01}
            longitude={userPosition.longitude - 0.02}
            offsetLeft={-19}
            offsetTop={-37}
            >
            <PinIcon size={40} color="blue" />
          </Marker>
          <Marker
            latitude={userPosition.latitude + 0.01}
            longitude={userPosition.longitude - 0.023}
            offsetLeft={-19}
            offsetTop={-37}
            >
            <PinIcon size={40} color="green" />
          </Marker>
        </>

      )}

      {/* Draft Pin */}
      {state.draft && (
        <Marker
        latitude={state.draft.latitude}
        longitude={state.draft.longitude}
        offsetLeft={-19}
        offsetTop={-37}
        >
        <PinIcon size={40} color="hotpink" />
      </Marker>
      )}
    </ReactMapGL>

    {/* Blog area to add Pin content */}
    <Blog />
  </div>)
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
