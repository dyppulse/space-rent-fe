import { useState, useMemo } from 'react'
import { Box, Button, Dialog, IconButton, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

function ImageGallery({ images = [], name = '' }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const imageUrls = useMemo(
    () => (images || []).map((img) => img?.url || '/placeholder.svg'),
    [images]
  )

  const openLightbox = (idx) => {
    setIndex(idx)
    setOpen(true)
  }

  const closeLightbox = () => setOpen(false)

  const next = () => setIndex((prev) => (prev + 1) % imageUrls.length)
  const prev = () => setIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)

  const primary = imageUrls[0] || '/placeholder.svg'
  const side = imageUrls.slice(1, 5)

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: { xs: 'block', md: 'grid' },
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '200px 200px',
          gap: 1,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Mobile: single image */}
        <Box
          onClick={() => openLightbox(0)}
          sx={{
            display: { xs: 'block', md: 'none' },
            height: 260,
            '& img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
            cursor: 'pointer',
          }}
        >
          <img src={primary} alt={name} />
        </Box>

        {/* Desktop: 1 large + 4 small */}
        <Box
          onClick={() => openLightbox(0)}
          sx={{
            display: { xs: 'none', md: 'block' },
            gridColumn: '1 / 2',
            gridRow: '1 / 3',
            '& img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
            cursor: 'pointer',
          }}
        >
          <img src={primary} alt={name} />
        </Box>

        {side.map((url, i) => (
          <Box
            key={url + i}
            onClick={() => openLightbox(i + 1)}
            sx={{
              display: { xs: 'none', md: 'block' },
              '& img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
              cursor: 'pointer',
            }}
          >
            <img src={url} alt={`${name}-${i + 1}`} />
          </Box>
        ))}

        {imageUrls.length > 0 && (
          <Button
            variant="contained"
            size="small"
            onClick={() => openLightbox(0)}
            sx={{ position: 'absolute', right: 12, bottom: 12, borderRadius: 20 }}
          >
            View all photos
          </Button>
        )}
      </Box>

      <Dialog open={open} onClose={closeLightbox} maxWidth="lg" fullWidth>
        <Box
          sx={{ position: 'relative', bgcolor: 'black' }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'Escape') closeLightbox()
          }}
        >
          <IconButton
            onClick={closeLightbox}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>

          {imageUrls.length > 1 && (
            <IconButton
              onClick={prev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 8,
                color: 'white',
                zIndex: 1,
                transform: 'translateY(-50%)',
              }}
              aria-label="Previous"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          {imageUrls.length > 1 && (
            <IconButton
              onClick={next}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 8,
                color: 'white',
                zIndex: 1,
                transform: 'translateY(-50%)',
              }}
              aria-label="Next"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}

          <Box
            sx={{
              width: '100%',
              height: { xs: 360, sm: 560 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onTouchStart={(e) => (e.currentTarget.dataset.x = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const startX = Number(e.currentTarget.dataset.x || 0)
              const delta = e.changedTouches[0].clientX - startX
              if (delta > 40) prev()
              if (delta < -40) next()
            }}
          >
            <img
              src={imageUrls[index]}
              alt={`${name}-${index}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>

          {imageUrls.length > 1 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ p: 2, bgcolor: 'black', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              {imageUrls.map((u, i) => (
                <Box
                  key={u + i}
                  onClick={() => setIndex(i)}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1,
                    overflow: 'hidden',
                    outline: i === index ? '2px solid white' : 'none',
                    cursor: 'pointer',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    },
                  }}
                >
                  <img src={u} alt={`thumb-${i}`} />
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Dialog>
    </>
  )
}

export default ImageGallery
