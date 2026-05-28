import { ref } from 'vue'

export const useScoutStore = () => {
  const scouts = ref([
    { id: 1, jobSeeker: '佐藤太郎', companyName: '清水建設', createdAt: '2021-08-20', status: '編集中' },
    { id: 2, jobSeeker: '田中花子', companyName: '鹿島建設', createdAt: '2020-11-10', status: '営業リーダー承認待ち' },
    { id: 3, jobSeeker: '鈴木一郎', companyName: '大成建設', createdAt: '2024-01-18', status: '承認済' },
    { id: 4, jobSeeker: '山田次郎', companyName: '竹中工務店', createdAt: '2026-02-11', status: '差戻し' }
  ])

  const currentScout = ref({
    id: 1,
    creatorName: '賀上',
    appliedAt: '2025-09-15 23:47:43',
    senderName: '山田太郎',
    senderAge: 23,
    senderGender: '男',
    companyName: '(株)トラスト',
    jobType: 'エンジニア',
    jobDescription: 'Webアプリケーション開発',
    requiredSkills: 'Vue.js, TypeScript',
    location: '東京都港区',
    salary: '600万円~',
    appeal: '最新技術を使った開発',
    scoutText: 'Aiが生成したスカウト文です...',
    status: '編集中'
  })

  const fetchScoutList = async () => {
    console.log('Mock fetchScoutList')
    return scouts.value
  }

  const fetchScoutDetail = async (id: number) => {
    console.log('Mock fetchScoutDetail:', id)
    return currentScout.value
  }

  const generateScout = async (data: any) => {
    console.log('Mock generateScout:', data)
    return { id: 999, ...data }
  }

  const updateScout = async (id: number, data: any) => {
    console.log('Mock updateScout:', id, data)
  }

  const deleteScout = async (id: number) => {
    console.log('Mock deleteScout:', id)
  }

  const requestApproval = async (id: number) => {
    console.log('Mock requestApproval:', id)
  }

  const fetchLeaderList = async () => {
    console.log('Mock fetchLeaderList')
    return {
      pending: [
        { id: 1, companyName: '(株)トラスト', senderName: '山田太郎', creatorName: '賀上', appliedAt: '2021-08-20' },
        { id: 2, companyName: 'Strings of Serenity', senderName: '田中花子', creatorName: 'Harmony Collective', appliedAt: '2020-11-10' }
      ],
      approved: [
        { id: 1, companyName: '(株)トラスト', senderName: '佐藤花子', creatorName: '平山', approvedAt: '2021-08-21' }
      ]
    }
  }

  const approveScout = async (id: number) => {
    console.log('Mock approveScout:', id)
  }

  const rejectScout = async (id: number, reason: string) => {
    console.log('Mock rejectScout:', id, reason)
  }

  return {
    scouts,
    currentScout,
    loading: ref(false),
    error: ref(null),
    fetchScoutList,
    fetchScoutDetail,
    generateScout,
    updateScout,
    deleteScout,
    requestApproval,
    fetchLeaderList,
    approveScout,
    rejectScout
  }
}