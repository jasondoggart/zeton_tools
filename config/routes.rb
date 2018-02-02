Rails.application.routes.draw do
  resources :documents
  resources :team_members
  get 'pages/home'
  get 'projects/:id/instruments', to: 'projects#project_instruments', as: :project_instruments
  get 'projects/:id/instruments/metrics', to: 'projects#project_instruments_metrics', as: :project_instruments_metrics
  get 'projects/:id/equipment', to: 'projects#project_equipment', as: :project_equipment
  get 'projects/:id/equipment/metrics', to: 'projects#project_equipment_metrics', as: :project_equipment_metrics
  get 'projects/:id/rfis', to: 'projects#project_rfis', as: :project_rfis
  get 'projects/:id/documents', to: 'projects#project_documents', as: :project_documents

  root to: 'pages#home'
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
  resources :users, controller: :users, only: :create
end
