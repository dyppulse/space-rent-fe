import { describe, it, expect, vi, beforeEach } from 'vitest'
import { spaceService } from '../../api/services/spaceService'
import axiosInstance, { unProtectedAxiosInstance } from '../../api/axiosInstance'

vi.mock('../../api/axiosInstance', async (orig) => {
  await orig()
  return {
    __esModule: true,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: { response: { use: vi.fn() } },
    },
    unProtectedAxiosInstance: {
      get: vi.fn(),
      interceptors: { response: { use: vi.fn() } },
    },
  }
})

describe('spaceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds query and returns spaces with defaults', async () => {
    unProtectedAxiosInstance.get.mockResolvedValueOnce({
      data: {
        spaces: [
          { id: '1', name: 'Hall', amenities: [] },
          { id: '2', name: 'Studio', amenities: [], images: [{ url: 'a' }] },
        ],
      },
    })
    const res = await spaceService.getSpaces({ search: 'x', spaceType: 'all' })
    expect(unProtectedAxiosInstance.get).toHaveBeenCalled()
    expect(res.spaces[0].images).toEqual([])
    expect(res.spaces[0].price).toEqual({})
  })

  it('gets a space by id and ensures defaults', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { space: { id: '1', name: 'A' } } })
    const space = await spaceService.getSpace('1')
    expect(axiosInstance.get).toHaveBeenCalledWith('/spaces/1')
    expect(space.images).toEqual([])
  })

  it('normalizes getMySpaces responses', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { spaces: [{ id: 'x', amenities: [] }] } })
    const list = await spaceService.getMySpaces()
    expect(Array.isArray(list)).toBe(true)
    expect(list[0].images).toEqual([])
  })

  it('createSpace posts multipart data', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { ok: true } })
    const res = await spaceService.createSpace({ name: 'N', images: [] })
    expect(axiosInstance.post).toHaveBeenCalled()
    expect(res).toEqual({ ok: true })
  })

  it('updateSpace patches multipart data', async () => {
    axiosInstance.patch.mockResolvedValueOnce({ data: { ok: true } })
    const res = await spaceService.updateSpace({ id: '1', values: { name: 'N' } })
    expect(axiosInstance.patch).toHaveBeenCalledWith(
      '/spaces/1',
      expect.any(FormData),
      expect.any(Object)
    )
    expect(res).toEqual({ ok: true })
  })

  it('deleteSpace calls delete', async () => {
    axiosInstance.delete.mockResolvedValueOnce({ data: { ok: true } })
    const res = await spaceService.deleteSpace('1')
    expect(axiosInstance.delete).toHaveBeenCalledWith('/spaces/1')
    expect(res).toEqual({ ok: true })
  })
})
