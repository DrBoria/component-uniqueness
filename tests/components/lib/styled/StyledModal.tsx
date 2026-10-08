import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Backdrop = styled.div`
	position: absolute;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
`;

const Dialog = styled.div`
	position: relative;
	z-index: 10;
	width: 100%;
	max-width: 32rem;
	border-radius: 0.75rem;
	background-color: #fff;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #e5e7eb;
	padding: 1rem 1.25rem;
`;

const Title = styled.h2`
	font-size: 1.125rem;
	font-weight: 600;
	color: #111827;
`;

const CloseButton = styled.button`
	color: #9ca3af;
	&:hover {
		color: #4b5563;
	}
`;

const Body = styled.div`
	max-height: 60vh;
	overflow-y: auto;
	padding: 1rem 1.25rem;
`;

const Footer = styled.footer`
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	border-top: 1px solid #e5e7eb;
	padding: 0.75rem 1.25rem;
`;

interface StyledModalProps {
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	onClose: () => void;
}

const StyledModal = ({ title, children, footer, onClose }: StyledModalProps) => {
	return (
		<Overlay>
			<Backdrop onClick={onClose} aria-hidden="true" />
			<Dialog role="dialog" aria-modal="true" aria-label={title}>
				<Header>
					<Title>{title}</Title>
					<CloseButton type="button" onClick={onClose} aria-label="Close dialog">
						&times;
					</CloseButton>
				</Header>
				<Body>{children}</Body>
				{footer && <Footer>{footer}</Footer>}
			</Dialog>
		</Overlay>
	);
};

export default StyledModal;
