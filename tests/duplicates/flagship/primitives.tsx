import styled from "styled-components";

/**
 * Visual primitives for the workspace dashboard. Each one is a styled-component
 * that expands to exactly one HTML element — the decomposition is by *element kind*,
 * not by feature, which is the opposite of the canon's feature-first tree.
 */

export const Shell = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #f8fafc;
`;

export const TopBar = styled.header`
	position: sticky;
	top: 0px;
	z-index: 10;
	display: flex;
	align-items: center;
	gap: 24px;
	height: 64px;
	border-bottom: 1px solid #e2e8f0;
	background: #ffffff;
	padding: 0px 24px;
`;

export const Wordmark = styled.a`
	font-size: 16px;
	font-weight: 700;
	color: #0f172a;
`;

export const NavBar = styled.nav`
	display: flex;
	align-items: center;
	gap: 16px;
`;

export const NavItem = styled.a`
	font-size: 13px;
	font-weight: 500;
	color: #64748b;
	&:hover {
		color: #0f172a;
	}
`;

export const CurrentNavItem = styled.a`
	font-size: 13px;
	font-weight: 500;
	color: #4f46e5;
`;

export const SearchForm = styled.form`
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const ScreenReaderText = styled.label`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0px;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0px;
`;

export const SearchField = styled.input`
	height: 34px;
	width: 240px;
	border-radius: 6px;
	border: 1px solid #e2e8f0;
	padding: 0px 10px;
	font-size: 13px;
	color: #0f172a;
`;

export const IconSubmit = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 34px;
	width: 34px;
	border-radius: 6px;
	background: #4f46e5;
	color: #ffffff;
	&:hover {
		background: #4338ca;
	}
`;

export const RoundIcon = styled.button`
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 36px;
	width: 36px;
	border-radius: 9999px;
	color: #475569;
	&:hover {
		background: #f1f5f9;
	}
`;

export const UnreadDot = styled.span`
	position: absolute;
	right: 6px;
	top: 6px;
	height: 8px;
	width: 8px;
	border-radius: 9999px;
	background: #ef4444;
`;

export const Body = styled.div`
	margin: 0px auto;
	display: flex;
	width: 100%;
	max-width: 1120px;
	flex: 1 1 0%;
	gap: 24px;
	padding: 24px;
`;

export const Primary = styled.main`
	display: flex;
	flex: 1 1 0%;
	flex-direction: column;
	gap: 24px;
`;

export const Secondary = styled.aside`
	display: flex;
	width: 300px;
	flex-direction: column;
	gap: 24px;
`;

export const Panel = styled.section`
	border-radius: 12px;
	border: 1px solid #e2e8f0;
	background: #ffffff;
`;

export const PaddedPanel = styled.section`
	border-radius: 12px;
	border: 1px solid #e2e8f0;
	background: #ffffff;
	padding: 20px;
`;

export const PanelHead = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #e2e8f0;
	padding: 16px 20px;
`;

export const PanelTitle = styled.h2`
	margin: 0px;
	font-size: 15px;
	font-weight: 600;
	color: #0f172a;
`;

export const PrimaryAction = styled.button`
	border-radius: 6px;
	background: #4f46e5;
	padding: 6px 12px;
	font-size: 12px;
	font-weight: 600;
	color: #ffffff;
	&:hover {
		background: #4338ca;
	}
`;

export const DarkAction = styled.button`
	border-radius: 6px;
	background: #0f172a;
	padding: 8px 12px;
	font-size: 12px;
	font-weight: 600;
	color: #ffffff;
	&:hover {
		background: #1e293b;
	}
`;

export const TileGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
	padding: 20px;
`;

export const Tile = styled.article`
	display: flex;
	flex-direction: column;
	gap: 6px;
	border-radius: 12px;
	border: 1px solid #e2e8f0;
	background: #ffffff;
	padding: 16px;
`;

export const TileHead = styled.header`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	font-weight: 500;
	color: #64748b;
`;

export const TileLabel = styled.h3`
	margin: 0px;
	font-size: 12px;
	font-weight: 500;
`;

export const TileNumber = styled.p`
	margin: 0px;
	font-size: 24px;
	font-weight: 600;
	line-height: 30px;
	color: #0f172a;
`;

export const TileTrend = styled.span<{ $attention?: boolean }>`
	font-size: 12px;
	font-weight: 500;
	color: ${({ $attention }) => ($attention ? "#b45309" : "#166534")};
`;

export const CountPill = styled.span`
	border-radius: 9999px;
	background: #f1f5f9;
	padding: 2px 8px;
	font-size: 11px;
	font-weight: 500;
	color: #475569;
`;

export const MutedNote = styled.span`
	font-size: 12px;
	color: #64748b;
`;

export const RowList = styled.ul`
	margin: 0px;
	display: flex;
	flex-direction: column;
	list-style: none;
	padding: 0px;
`;

export const Row = styled.li`
	display: flex;
	align-items: center;
	gap: 12px;
	border-bottom: 1px solid #f1f5f9;
	padding: 12px 20px;
	&:last-child {
		border-bottom-width: 0px;
	}
`;

export const RowCheck = styled.input`
	height: 16px;
	width: 16px;
	accent-color: #4f46e5;
`;

export const RowMain = styled.div`
	display: flex;
	flex: 1 1 0%;
	flex-direction: column;
`;

export const RowTitle = styled.span`
	font-size: 13px;
	font-weight: 500;
	color: #0f172a;
`;

export const RowMeta = styled.span`
	font-size: 11px;
	color: #64748b;
`;

export const OutlinePill = styled.span`
	border-radius: 4px;
	border: 1px solid #e2e8f0;
	padding: 2px 6px;
	font-size: 11px;
	font-weight: 500;
	color: #475569;
`;

export const StatusPill = styled.span`
	border-radius: 4px;
	background: #eef2ff;
	padding: 2px 6px;
	font-size: 11px;
	font-weight: 500;
	color: #4338ca;
`;

export const BoardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
	padding: 20px;
`;

export const BoardCard = styled.article`
	display: flex;
	flex-direction: column;
	gap: 8px;
	border-radius: 10px;
	border: 1px solid #e2e8f0;
	background: #f8fafc;
	padding: 14px;
`;

export const CardTitle = styled.h3`
	margin: 0px;
	font-size: 13px;
	font-weight: 600;
	color: #0f172a;
`;

export const CardText = styled.p`
	margin: 0px;
	font-size: 12px;
	line-height: 18px;
	color: #64748b;
`;

export const MeterRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const MeterTrack = styled.div`
	height: 6px;
	flex: 1 1 0%;
	overflow: hidden;
	border-radius: 9999px;
	background: #e2e8f0;
`;

export const MeterFill = styled.div<{ $percent: number }>`
	height: 6px;
	border-radius: 9999px;
	background: #4f46e5;
	width: ${({ $percent }) => `${$percent}%`};
`;

export const MeterValue = styled.span`
	font-size: 11px;
	font-weight: 500;
	color: #475569;
`;

export const CardFoot = styled.footer`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const TinyMuted = styled.span`
	font-size: 11px;
	color: #94a3b8;
`;

export const TinyLink = styled.a`
	font-size: 11px;
	font-weight: 500;
	color: #4f46e5;
	&:hover {
		text-decoration: underline;
	}
`;

export const InviteForm = styled.form`
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const FieldLabel = styled.label`
	font-size: 12px;
	font-weight: 500;
	color: #475569;
`;

export const TextField = styled.input`
	height: 36px;
	border-radius: 6px;
	border: 1px solid #e2e8f0;
	padding: 0px 10px;
	font-size: 13px;
	color: #0f172a;
`;

export const Feed = styled.ol`
	margin: 0px;
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	list-style: none;
	padding: 0px;
`;

export const FeedRow = styled.li`
	display: flex;
	align-items: flex-start;
	gap: 8px;
`;

export const FeedMain = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FeedText = styled.span`
	font-size: 12px;
	color: #334155;
`;

export const RosterName = styled.span`
	font-size: 12px;
	font-weight: 500;
	color: #0f172a;
`;

export const Roster = styled.ul`
	margin: 0px;
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	list-style: none;
	padding: 0px;
`;

export const RosterRow = styled.li`
	display: flex;
	align-items: center;
	gap: 10px;
`;

export const PageFoot = styled.footer`
	border-top: 1px solid #e2e8f0;
	background: #ffffff;
	padding: 16px 24px;
`;

export const FootInner = styled.div`
	margin: 0px auto;
	display: flex;
	max-width: 1120px;
	align-items: center;
	justify-content: space-between;
`;

export const Copyright = styled.p`
	margin: 0px;
	font-size: 12px;
	color: #64748b;
`;

export const FootLink = styled.a`
	font-size: 12px;
	color: #64748b;
	&:hover {
		color: #0f172a;
	}
`;
