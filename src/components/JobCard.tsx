import { motion } from 'framer-motion'
import { MapPin, Hash, Calendar, MoreVertical, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import type { Job, JobStatus } from '../App'

interface JobCardProps {
  job: Job
  onStatusChange: (jobId: string, status: JobStatus) => void
  onDelete: (jobId: string) => void
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dotColor: 'bg-orange-500'
  },
  'in-progress': {
    label: 'In Progress',
    icon: AlertTriangle,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500'
  },
  ready: {
    label: 'Ready',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
    dotColor: 'bg-green-500'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-500'
  }
}

export function JobCard({ job, onStatusChange, onDelete }: JobCardProps) {
  const config = statusConfig[job.status]
  const StatusIcon = config.icon

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-200 group">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.color.replace('text-', 'text-white ').replace('border-', 'bg-').split(' ')[0]}`}>
                <StatusIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">{job.jobNumber}</span>
                </div>
                <Badge variant="outline" className={`mt-1 ${config.color} border`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`} />
                  {config.label}
                </Badge>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onDelete(job.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700 text-sm leading-relaxed">{job.address}</p>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 leading-relaxed">{job.notes}</p>
            </div>
          )}

          {/* Status Selector */}
          <div className="mb-4">
            <Select
              value={job.status}
              onValueChange={(value: JobStatus) => onStatusChange(job.id, value)}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="in-progress">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    In Progress
                  </div>
                </SelectItem>
                <SelectItem value="ready">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Ready
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(job.createdAt)}</span>
            </div>
            {job.updatedAt.getTime() !== job.createdAt.getTime() && (
              <div className="text-xs text-slate-500">
                Updated {formatDate(job.updatedAt)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}