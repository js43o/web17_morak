import { vars } from '@styles';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  zIndex: 100,
  height: '100%',
  transition: 'transform 0.5s',
});

export const closed = style({
  transform: 'translateX(-40rem)',
});

export const panel = style({
  display: 'flex',
  width: '40rem',
  height: '100%',
  borderRight: `1px solid ${vars.color.grayscale100}`,
});

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  width: '2.4rem',
  height: '4.8rem',
  padding: 0,
  border: `1px solid ${vars.color.grayscale200}`,
  borderRadius: '0 0.8rem 0.8rem 0',
  borderLeftColor: 'transparent',
  background: vars.color.grayscaleWhite,
  cursor: 'pointer',

  ':hover': {
    filter: 'brightness(1.1)',
  },
  ':active': {
    filter: 'brightness(0.9)',
  },
});

export const flip = style({
  transform: 'rotate(180deg)',
});
