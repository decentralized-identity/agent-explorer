import axios from 'axios'
import { GameState } from './index.js'


export const API_URL = 'https://game.codyfight.com/'

export class GameAPI {
  public apiURL: string

  constructor(apiURL: string = API_URL) {
    this.apiURL = apiURL
  }

  async init(
    ckey: string,
    mode: 0 | 1 | 2 | 3,
    opponent?: string
  ): Promise<GameState> {
    return await this.makeRequest('POST', { ckey, mode, opponent })
  }

  async cast(
    ckey: string,
    skill_id: number,
    x: number,
    y: number
  ): Promise<GameState> {
    return await this.makeRequest('PATCH', { ckey, skill_id, x, y })
  }

  async move(ckey: string, x: number, y: number): Promise<GameState> {
    return await this.makeRequest('PUT', { ckey, x, y })
  }

  async check(ckey: string): Promise<GameState> {
    return await this.makeRequest('GET', { ckey })
  }

  private async makeRequest(method: string, params: any): Promise<any> {
    const config = {
      method,
      url: this.apiURL,
      headers: { 'Content-Type': 'application/json' },
      data: {},
    }

    if (method !== 'GET' && method !== 'HEAD') {
      config.data = params
    }

    if (method === 'GET') {
      config.url = `${this.apiURL}?ckey=${params.ckey}`
    }
    try {
      const { data } = await axios(config)
      return data
    } catch (e: any) {
      throw new Error(e.response.data.message)
    }
  }
}
