//Modified from https://gist.github.com/LekoArts/d31103c960078473eebfa5ad0b6cddf1
import { Box, BoxProps } from "@chakra-ui/react"

interface ISpacerProps extends BoxProps {
  size: BoxProps["width"]
  axis: "vertical" | "horizontal"
}

const Spacer = ({ size, axis }: ISpacerProps) => {
  const width = axis === `vertical` ? `1px` : size
  const height = axis === `horizontal` ? `1px` : size
  return <Box as="span" width={width} height={height} minWidth={width} minHeight={height} display="block" />
}

export default Spacer