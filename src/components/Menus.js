import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function Menus({
    regions,
    selectedRegion,
    setSelectedRegion,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const classes = useStyles();
    const trigger = useScrollTrigger({ threshold: 50 });

    return (
        <Slide in={!trigger}>
            <AppBar position="fixed">
                <Toolbar className="toolbar">
                    <IconButton
                        className="menuButton"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={() => setMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" className={classes.title}>
                        {selectedRegion && selectedRegion.name}
                    </Typography>
                    <SwipeableDrawer
                        anchor="left"
                        open={menuOpen}
                        onOpen={() => setMenuOpen(true)}
                        onClose={() => setMenuOpen(false)}
                    >
                        <List>
                            {regions.map((region, index) => (
                                <ListItem
                                    button
                                    key={region.pruid}
                                    onClick={() => {
                                        setSelectedRegion(region);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <ListItemText primary={region.name} />
                                    <Chip label={formatNumber(region.total)} color="primary" />
                                </ListItem>
                            ))}
                        </List>
                    </SwipeableDrawer>
                </Toolbar>
            </AppBar>
        </Slide>
    );
}

export default Menus;