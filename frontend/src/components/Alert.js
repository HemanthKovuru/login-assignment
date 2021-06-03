import "./scss/Form.scss";

const Alert = (props) => {
  return (
    <div className='form-bg'>
      <div className='signin-box'>{props.children}</div>
    </div>
  );
};

export default Alert;
