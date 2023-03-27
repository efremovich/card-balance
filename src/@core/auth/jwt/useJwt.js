import JwtService from './jwtService'; // ./jwtService

export default function useJwt(axiosIns, jwtOverrideConfig) {
  const jwt = new JwtService(axiosIns, jwtOverrideConfig);

  return {
    jwt,
  };
}
