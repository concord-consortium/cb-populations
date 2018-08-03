// we use 2.4.1 because 2.4.2 & 2.4.3 have unfixed bugs
// cf. https://github.com/ctrlplusb/react-sizeme/issues/135
declare module "react-sizeme";
// usage: interface IComponentProps extends ISizeMeProps
interface ISizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  }
}
