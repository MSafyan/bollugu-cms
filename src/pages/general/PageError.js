/*
  Imports
*/
import { Box, Button, Container, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MotionContainer, varBounceIn } from 'src/components/animate';
import Page from 'src/components/Page';
import { Image401, Image404 } from 'src/config/settings';
import palette from 'src/theme/palette';

/*
  Main Working
*/
export default ({ e404 }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-2);
  };

  let heading = "Sorry, You are not allowed here!";
  let text = "";
  let image = Image401;

  if (e404) {
    heading = "Sorry, page not found!";
    text = "Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.";
    image = Image404;
  }

  return (
    <Page title="404">
      <Container>
        <MotionContainer initial="initial" open>
          <Box
            sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}
            mt={{ xs: 10, sm: 12, md: 'auto', lg: 'auto', xl: 'auto' }}
          >
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                {heading}
              </Typography>
            </motion.div>
            <Typography sx={{ color: palette.text.secondary }}>
              {text}
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src={image}
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={goBack} size="large" variant="contained">
              Go Back
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </Page>
  );
};
