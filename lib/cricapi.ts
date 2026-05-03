// ESPN Cricket API - Free, no key needed
export async function fetchLiveMatches() {
  try {
    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/cricket/matches',
      { next: { revalidate: 60 } }
    );
    
    const data = await response.json();
    
    if (!data.events) {
      return getBackupMockData();
    }

    return data.events.map((event: any) => ({
      id: event.id,
      name: event.name,
      status: event.status?.type === 'STATUS_IN_PROGRESS' ? 'LIVE' : event.status?.type?.replace('STATUS_', ''),
      league: extractLeague(event.name),
      competitors: event.competitions?.[0]?.competitors?.map((comp: any) => ({
        name: comp.team?.displayName || comp.displayName,
        score: comp.score || '-'
      })) || [],
      venue: event.competitions?.[0]?.venue?.fullName || 'Unknown Venue',
      date: event.date
    }));
  } catch (error) {
    console.error('Error fetching from ESPN API:', error);
    return getBackupMockData();
  }
}

function extractLeague(name: string): string {
  if (name.includes('T20')) return 'T20';
  if (name.includes('ODI')) return 'ODI';
  if (name.includes('Test')) return 'Test';
  if (name.includes('IPL')) return 'IPL';
  if (name.includes('PSL')) return 'PSL';
  return 'International';
}

function getBackupMockData() {
  return [
    {
      id: '1',
      name: 'India vs Pakistan T20',
      status: 'LIVE',
      league: 'T20',
      competitors: [
        { name: 'India', score: '120/3' },
        { name: 'Pakistan', score: '0/0' }
      ],
      venue: 'MCG, Melbourne',
      date: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Peshawar Zalmi vs Lahore Qalandars',
      status: 'LIVE',
      league: 'PSL',
      competitors: [
        { name: 'Peshawar Zalmi', score: '145/6' },
        { name: 'Lahore Qalandars', score: '0/0' }
      ],
      venue: 'Gaddafi Stadium',
      date: new Date().toISOString()
    }
  ];
}