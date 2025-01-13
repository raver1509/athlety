import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import EventInfoButton from './EventInfoButton';

export default function BasicCard({src = '', name = '', date = '', desc = '', id}) {
  return (
    <Card sx={{ width: 340 }}>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={src}
          srcSet={src + " 2x"}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <div>
        <Typography level="title-lg">{name}</Typography>
        <Typography level="body-sm">{date}</Typography>
        <Typography 
          level="body-sm" 
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            minHeight: '68px'
          }}
        >
          {desc}
        </Typography>
      </div>
      <CardContent orientation="horizontal">
        <EventInfoButton id={id}/>
        <Button
          variant="solid"
          size="md"
          color="primary"
          aria-label="Sign up!"
          sx={{ ml: 'auto', fontWeight: 800, marginLeft: 'none', backgroundColor: 'black', color: 'white', border: '1px solid', borderColor: '#ddd', width: '160px' }}
        >
          Sign up!
        </Button>
      </CardContent>
    </Card>
  );
}