// eslint-disable-next-line import/extensions
import useJwt from '@core/auth/jwt/useJwt';
import axios from '@axios';

const { jwt } = useJwt(axios, {});
export default jwt;
