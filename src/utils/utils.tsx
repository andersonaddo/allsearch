//https://create-react-app.dev/docs/adding-custom-environment-variables/
export const isInDevMove = () : boolean => {
    return process.env.NODE_ENV !== 'development';
}