import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Copyright from "./copyright";
import { Emulator } from "android-emulator-webrtc/emulator";
import LogcatView from "./logcat_view";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ImageIcon from "@material-ui/icons/Image";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import Slider from "@material-ui/core/Slider";
import PropTypes from "prop-types";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

class EmulatorScreen extends React.Component {
  state = {
    view: "webrtc",
    error_snack: false,
    error_msg: "",
    emuState: "connecting",
    muted: true,
    volume: 0.0,
    hasAudio: false,
    gps: { latitude: 37.4221, longitude: -122.0841 },
  };

  static propTypes = {
    uri: PropTypes.string, // grpc endpoint
    auth: PropTypes.object, // auth module to use.
  };

  stateChange = (s) => {
    this.setState({ emuState: s });
  };

  onAudioStateChange = (s) => {
    console.log("Received an audio state change from the emulator.");
    this.setState({ hasAudio: s });
  };

  onError = (err) => {
    this.setState({
      error_snack: true,
      error_msg: "Low level gRPC error: " + JSON.stringify(err),
    });
  };

  updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const loc = location.coords;
        this.setState({
          gps: { latitude: loc.latitude, longitude: loc.longitude },
        });
      });
    }
  };

  handleClose = (e) => {
    this.setState({ error_snack: false });
  };

  handleVolumeChange = (e, newVolume) => {
    const muted = newVolume === 0;
    this.setState({ volume: newVolume, muted: muted });
  };

  render() {
    const { uri, auth, classes } = this.props;
    const {
      view,
      emuState,
      error_snack,
      error_msg,
      muted,
      volume,
      hasAudio,
      gps,
    } = this.state;
    return (
      <div
        className="emulator-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "100vh",
        }}
      >
        <div style={{}}>
          <Emulator
            uri={uri}
            auth={auth}
            view={this.state.view}
            onStateChange={this.stateChange}
            onAudioStateChange={this.onAudioStateChange}
            onError={this.onError}
            muted={muted}
            volume={volume}
            gps={gps}
          />
          {/* <p>New State: {emuState} </p> */}
        </div>
        {/* <Snackbar open={error_snack} autoHideDuration={6000}>
          <Alert onClose={this.handleClose} severity="error">
            {error_msg}
          </Alert>
        </Snackbar> */}
      </div>
    );
  }
}

export default EmulatorScreen;
