import ReCAPTCHA from 'react-google-recaptcha';

const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LdoXFUcAAAAALtgWfChyS17dSHKwICv81fHgsA7';

export default function ReCaptcha({ style, setCaptcha }) {

  const handleReCAPTCHAChange = value => value && setCaptcha(true);
  const handleReCAPTCHAExpired = exp => exp && setCaptcha(false);
  const handleReCAPTCHAErrored = err => err && setCaptcha(false);

  return (
    <div className="macro_chk_box" style={style}>
      <ReCAPTCHA 
        sitekey={ SITE_KEY }
        onChange={handleReCAPTCHAChange}
        onExpired={handleReCAPTCHAExpired}
        onErrored={handleReCAPTCHAErrored}
      />
    </div>
  )
}