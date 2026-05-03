export async function fetchLiveMatches() {
  try {
    // Using CricketData.org API (Free, real data)
    const response = await fetch(
      'https://api.cricketdata.org/cricket/match/livescore',
      { 
        next: { revalidate: 30 },
        headers: {
          'Authorization': 'Bearer YOUR_KEY_HERE'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((match: any) => ({
        id: match.match_id || Math.random(),
        name: match.series_name || 'Match',
        status: match.match_status || 'Scheduled',
        league: extractLeague(match.series_name || ''),
        competitors: [
          { name: match.team_1 || 'Team 1', score: match.team_1_score || '-' },
          { name: match.team_2 || 'Team 2', score: match.team_2_score || '-' }
        ],
        venue: match.venue || 'Unknown',
        date: match.match_date || new Date().toISOString()
      }));
    }
    
    return getBackupMockData();
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return getBackupMockData();
  }
}

function extractLeague(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('t20')) return 'T20';
  if (lower.includes('odi')) return 'ODI';
  if (lower.includes('test')) return 'Test';
  if (lower.includes('ipl')) return 'IPL';
  if (lower.includes('psl')) return 'PSL';
  return 'International';
}

function getBackupMockData() {
  return [
    {
      id: '1',
      name: 'Peshawar Zalmi vs Lahore Qalandars - PSL 2026',
      status: 'LIVE',
      league: 'PSL',
      competitors: [
        { name: 'Peshawar Zalmi', score: '156/4' },
        { name: 'Lahore Qalandars', score: '0/0' }
      ],
      venue: 'Gaddafi Stadium, Lahore',
      date: new Date().toISOString()
    },
    {
      id: '2',
      name: 'India vs New Zealand - T20',
      status: 'LIVE',
      league: 'T20',
      competitors: [
        { name: 'India', score: '142/3' },
        { name: 'New Zealand', score: '0/0' }
      ],
      venue: 'MCG, Melbourne',
      date: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Mumbai Indians vs Delhi Capitals - IPL',
      status: 'Scheduled',
      league: 'IPL',
      competitors: [
        { name: 'Mumbai Indians', score: '-' },
        { name: 'Delhi Capitals', score: '-' }
      ],
      venue: 'Wankhede Stadium, Mumbai',
      date: new Date().toISOString()
    }
  ];
}