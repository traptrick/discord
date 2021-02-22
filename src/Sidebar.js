import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CallIcon from '@material-ui/icons/Call';
import {Avatar} from "@material-ui/core";
import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import SettingsIcon from '@material-ui/icons/Settings';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import SidebarChannel from './SidebarChannel';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import db, { auth } from './firebase';

const Sidebar = () => {
    const user = useSelector(selectUser);

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        db.collection('channels').onSnapshot(snapshot => (
            setChannels(snapshot.docs.map(doc => ({
                id: doc.id,
                channel: doc.data(),
            })))
        ));
    }, [])

    const handleAddChannel = () => {
        const channelName = prompt("Enter A New Channel Name:");
        
        if(channelName){
            db.collection('channels').add({
                channelName: channelName,
            });
        }
    }

    const AvatarTooltip = withStyles((theme) => ({
        tooltip: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }))(Tooltip);

    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <h4>Discord</h4>
                <ExpandMoreIcon />
            </div>

            <div className="sidebar__channels">
                <div className="sidebar__channelsHeader">
                        <div className="sidebar__header">
                                <ExpandMoreIcon />
                                <h4>Text Channels</h4>
                        </div>
                    
                    <Tooltip title="Create New Channel">
                        <AddIcon onClick={handleAddChannel} className="sidebar__addChannel" />
                    </Tooltip>
                    
                </div>

                <div className="sidebar__channelsList">
                    {channels.map(({id, channel}) => (
                        <SidebarChannel key={id} id={id} channelName={channel.channelName}/>
                    ))}
                </div>
            </div>

          <div className="sidebar__voice">
              <SignalCellularAltIcon className="sidebar__voiceIcon"
              fontSize="large"/>
              <div className="sidebar__voiceInfo">
                  <h3>Voice Connected</h3>
                  <p>Stream</p>
              </div>

                <div className="sidebar__voiceIcons">
                    <InfoOutlinedIcon />
                    <CallIcon />
                </div>

          </div>

            <div className="sidebar__profile">

                <AvatarTooltip
                    title={
                        <>
                        <Typography color="inherit">Click Here To <b>{'LOGOUT'}</b></Typography>
                        </>
                    }
                >
                    <Avatar onClick={() => auth.signOut()} src={user.photo} style={{cursor: 'pointer'}}/>
                </AvatarTooltip>
                
                <div className="sidebar__profileInfo">
                    <h3>{user.displayName}</h3>
                    <p>#{user.uid.substring(0,5)}</p>
                </div>

                <div className="sidebar__profileIcons">
                    <MicIcon />
                    <HeadsetIcon />
                    <SettingsIcon />
                </div>
            </div>


        </div>
    )
}

export default Sidebar
