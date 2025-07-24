import { handleMessage } from './queueProcessor'
import * as peopleService from '../services/people.service'

jest.mock('../services/people.service')

describe('handleMessage', () => {
  let mockSend: jest.Mock
  let ws: any

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: false })

    mockSend = jest.fn()
    ws = {
      send: mockSend,
      readyState: 1,
      OPEN: 1,
    }
  })


async function flushTimers() {
    jest.runOnlyPendingTimers()
    await Promise.resolve()
  }
  

  afterEach(() => {
    jest.useRealTimers()
    jest.resetAllMocks()
  })

  it('should stop streaming if ws.readyState changes', async () => {
    const people = [{ id: '1' }, { id: '2' }, { id: '3' }];
    (peopleService.getFilteredPeople as jest.Mock).mockResolvedValue({ data: people, total: people.length })
  
    mockSend.mockImplementation(() => {
      ws.readyState = 0 // simulate closed socket during streaming
    })
  
    const promise = handleMessage({ type: 'start_stream', count: 3, page: 1 }, ws)
  
    jest.runAllTimers()
    await Promise.resolve()
  
    jest.runAllTimers()
    await Promise.resolve()
  
    await promise
  
    // Because readyState changed, streaming stops after first send
    expect(mockSend).toHaveBeenCalledTimes(1)
  })
})  