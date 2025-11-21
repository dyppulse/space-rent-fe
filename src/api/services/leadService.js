import axiosInstance, { unProtectedAxiosInstance } from '../axiosInstance'

export const leadService = {
  // Submit a lead form (public endpoint)
  submitLead: async (leadData) => {
    const response = await unProtectedAxiosInstance.post('/leads', leadData)
    return response.data
  },

  // Get all leads (admin only)
  getLeads: async (params = {}) => {
    const response = await axiosInstance.get('/leads', { params })
    return response.data
  },

  // Get single lead (admin only)
  getLead: async (leadId) => {
    const response = await axiosInstance.get(`/leads/${leadId}`)
    return response.data
  },

  // Update lead status (admin only)
  updateLeadStatus: async (leadId, status) => {
    const response = await axiosInstance.patch(`/leads/${leadId}/status`, { status })
    return response.data
  },
}
