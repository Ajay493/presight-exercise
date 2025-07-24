import { streamLongText } from './text.controller'
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'

describe('streamLongText Controller', () => {
  let res: any

  beforeEach(() => {
    jest.useFakeTimers()

    res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    }
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should set headers and write the text character by character, then end', () => {
    streamLongText({} as any, res);
  
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8');
    expect(res.setHeader).toHaveBeenCalledWith('Transfer-Encoding', 'chunked');
  
    expect(res.end).not.toHaveBeenCalled();
  
    jest.runAllTimers();
  
    expect(res.write).toHaveBeenCalled();
    expect(res.end).toHaveBeenCalled();
  });
  
})
