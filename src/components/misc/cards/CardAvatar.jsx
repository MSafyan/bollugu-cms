import { styled } from '@material-ui/core/styles';

export const CardAvatar = styled('img')({
  top: 0,
  width: '90%',
  height: '90%',
  objectFit: 'cover',
  position: 'absolute',
  borderRadius: 360,
  margin: '5%',
  boxShadow: 'rgba(0,0,0,0.8) 0 0 10px'
});
