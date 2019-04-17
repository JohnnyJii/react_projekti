import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  ListSubheader,
  IconButton,
} from '@material-ui/core';
import {OpenWith} from '@material-ui/icons';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ImageGrid = (props) => {
  return (
      <GridList>
        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
          <ListSubheader component="div">Files</ListSubheader>
        </GridListTile>
        {props.picArray.map(tile => (
            <GridListTile key={tile.file_id}>
              <img src={mediaUrl + tile.thumbnails.w160} alt={tile.title}/>
              <GridListTileBar
                  title={tile.title}
                  actionIcon={
                    <IconButton component={Link} to={'single/' + tile.file_id}>
                      <OpenWith color="secondary"/>
                    </IconButton>
                  }
              />
            </GridListTile>
        ))}
      </GridList>
  );
};

ImageGrid.propTypes = {
  picArray: PropTypes.array,
};

export default ImageGrid;
