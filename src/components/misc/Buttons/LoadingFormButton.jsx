import { LoadingButton } from "@material-ui/lab";

const style = {
  padding: '0px 70px'
};
export default ({ children, loading, disabled }) => {
  return (
    <LoadingButton
      style={style}
      size="large"
      type="submit"
      variant="contained"
      loading={loading}
      disabled={disabled}
    >
      {children}
    </LoadingButton>
  );
};