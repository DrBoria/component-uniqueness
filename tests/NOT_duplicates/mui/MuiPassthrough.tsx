import React from "react";
import { Box } from "@mui/material";

const MuiPassthrough = ({ children, ...props }: { children?: React.ReactNode } & React.ComponentProps<typeof Box>) => {
	return <Box data-slot="mui-passthrough" {...props}>{children}</Box>;
};

export default MuiPassthrough;
