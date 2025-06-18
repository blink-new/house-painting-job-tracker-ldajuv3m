import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Home, CheckCircle, Clock, AlertTriangle, UserPlus } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'

import { JobForm } from './components/JobForm'
import { JobCard } from './components/JobCard'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { BuilderForm } from './components/BuilderForm'

export type JobStatus = 'pending' | 'in-progress' | 'touch-ups-1' | 'touch-ups-2' | 'ready' | 'completed'

export interface Builder {
  id: string
  name: string
  contact: string
}

export interface Job {
  id: string
  jobNumber: string
  address: string
  status: JobStatus
  createdAt: Date
  updatedAt: Date
  notes?: string
  builderId?: string
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [builders, setBuilders] = useState<Builder[]>([])
  const [isJobFormOpen, setIsJobFormOpen] = useState(false)
  const [isBuilderFormOpen, setIsBuilderFormOpen] = useState(false)
  const { toast } = useToast()

  // Load jobs from localStorage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('painting-jobs')
    if (savedJobs) {
      const parsedJobs = JSON.parse(savedJobs).map((job: Job & { createdAt: string; updatedAt: string }) => ({
        id: job.id,
        jobNumber: job.jobNumber,
        address: job.address,
        status: job.status,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
        notes: job.notes,
        builderId: job.builderId,
      }))
      setJobs(parsedJobs)
    }
  }, [])

  // Load builders from localStorage on mount
  useEffect(() => {
    const savedBuilders = localStorage.getItem('painting-builders')
    if (savedBuilders) {
      setBuilders(JSON.parse(savedBuilders))
    }
  }, [])

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem('painting-jobs', JSON.stringify(jobs))
  }, [jobs])

  // Save builders to localStorage whenever builders change
  useEffect(() => {
    localStorage.setItem('painting-builders', JSON.stringify(builders))
  }, [builders])

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setJobs(prev => [newJob, ...prev])
    setIsJobFormOpen(false)
    toast({
      title: "Job Added",
      description: `Job #${jobData.jobNumber} has been created successfully.`,
    })
  }

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedJob = { ...job, status: newStatus, updatedAt: new Date() }

        // Send notification if job is ready
        if (newStatus === 'ready') {
          toast({
            title: "🎉 Job Ready!",
            description: `Job #${job.jobNumber} at ${job.address} is ready for review.`,
            variant: "default",
          })
        }

        return updatedJob
      }
      return job
    }))
  }

  const deleteJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    setJobs(prev => prev.filter(job => job.id !== jobId))
    if (job) {
      toast({
        title: "Job Deleted",
        description: `Job #${job.jobNumber} has been removed.`,
        variant: "destructive",
      })
    }
  }

  const addBuilder = (builderData: Omit<Builder, 'id'>) => {
    const newBuilder: Builder = {
      ...builderData,
      id: crypto.randomUUID(),
    }
    setBuilders(prev => [newBuilder, ...prev])
    setIsBuilderFormOpen(false)
    toast({
      title: "Builder Added",
      description: `${builderData.name} has been added to your builders list.`,
    })
  }

  const getStatusStats = () => {
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      inProgress: jobs.filter(j => j.status === 'in-progress').length,
      touchUps1: jobs.filter(j => j.status === 'touch-ups-1').length,
      touchUps2: jobs.filter(j => j.status === 'touch-ups-2').length,
      ready: jobs.filter(j => j.status === 'ready').length,
      completed: jobs.filter(j => j.status === 'completed').length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Painting Jobs</h1>
                <p className="text-slate-600">Track your house painting projects</p>
              </div>
            </div>
            <Button
              onClick={() => setIsJobFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Button>
            <Button
              onClick={() => setIsBuilderFormOpen(true)}
              variant="outline"
              className="ml-4 shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Builder
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Home className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Touch Ups 1</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.touchUps1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-yellow-800" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Touch Ups 2</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.touchUps2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Ready</p>
                  <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {jobs.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Home className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs yet</h3>
                <p className="text-slate-600 mb-6">Create your first painting job to get started</p>
                <Button
                  onClick={() => setIsJobFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <JobCard
                    job={job}
                    builders={builders}
                    onStatusChange={updateJobStatus}
                    onDelete={deleteJob}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Job Form Modal */}
        <JobForm
          open={isJobFormOpen}
          onOpenChange={setIsJobFormOpen}
          onSubmit={addJob}
          builders={builders}
        />

        {/* Builder Form Modal */}
        <BuilderForm
          open={isBuilderFormOpen}
          onOpenChange={setIsBuilderFormOpen}
          onSubmit={addBuilder}
        />
      </div>
      <Toaster />
    </div>
  )
}

export default App