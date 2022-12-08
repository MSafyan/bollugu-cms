import { Container } from "@material-ui/core";
import AuthLayout from "src/layouts/AuthLayout";
import { ContentStyle, SectionStyle } from "src/theme/logo-only-pages";
import { MHidden } from "../@material-extend";

export default ({ children, image }) => {

	/*
		Main Design
	*/

	return (
		<>
			<MHidden width="mdDown">
				<SectionStyle>
					<AuthLayout image={image} />
				</SectionStyle>
			</MHidden>
			<Container maxWidth="sm">
				<ContentStyle>
					<br />
					<br />

					{children}
				</ContentStyle>
			</Container>
		</>
	);
};