import {
	DownloadRounded,
	Image as ImageIcon,
	Landscape as LandscapeIcon,
} from '@mui/icons-material';
import {
	Dropdown,
	IconButton,
	ListItemDecorator,
	Menu,
	MenuButton,
	MenuItem,
} from '@mui/joy';
import { RefObject } from 'react';

export function DownloadButton({
	svgRef,
}: {
	svgRef: RefObject<SVGSVGElement>;
}) {
	const handleDownload = (type: 'svg' | 'png') => {
		const svg = svgRef.current!;

		const data = new XMLSerializer().serializeToString(svg);
		const svgBlob = new Blob([data], {
			type: 'image/svg+xml;charset=utf-8',
		});
		const url = URL.createObjectURL(svgBlob);
		if (type === 'svg') {
			const a = document.createElement('a');
			a.download = 'diagram.svg';
			a.href = url;
			a.click();
			a.remove();
		} else {
			// load the SVG blob to a flesh image object
			const img = new Image();
			img.addEventListener('load', () => {
				const { width, height } = svg.viewBox.baseVal;
				const canvas = document.createElement('canvas');
				canvas.width = width * 4;
				canvas.height = height * 4;

				const context = canvas.getContext('2d');
				context!.drawImage(img, 0, 0, width * 4, height * 4);

				URL.revokeObjectURL(url);

				// trigger a synthetic download operation with a temporary link
				const a = document.createElement('a');
				a.download = 'diagram.png';
				document.body.appendChild(a);
				a.href = canvas.toDataURL();
				a.click();
				a.remove();
			});
			img.src = url;
		}
	};
	return (
		<Dropdown>
			<MenuButton
				slots={{ root: IconButton }}
				slotProps={{
					root: { variant: 'outlined' },
				}}
			>
				<DownloadRounded />
			</MenuButton>
			<Menu placement="bottom-end" variant="outlined">
				<MenuItem onClick={() => handleDownload('svg')}>
					<ListItemDecorator>
						<LandscapeIcon />
					</ListItemDecorator>
					SVG
				</MenuItem>
				<MenuItem onClick={() => handleDownload('png')}>
					<ListItemDecorator>
						<ImageIcon />
					</ListItemDecorator>
					PNG
				</MenuItem>
			</Menu>
		</Dropdown>
	);
}
