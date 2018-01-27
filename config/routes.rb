Rails.application.routes.draw do
  resources :team_members
  get 'pages/home'
  get 'projects/:id/instruments', to: 'projects#project_instruments', as: :project_instruments
  get 'projects/:id/instruments/metrics', to: 'projects#project_instruments_metrics', as: :project_instruments_metrics
  get 'projects/:id/equipment', to: 'projects#project_equipment', as: :project_equipment
  get 'projects/:id/equipment/metrics', to: 'projects#project_equipment_metrics', as: :project_equipment_metrics
  get 'projects/:id/rfis', to: 'projects#project_rfis', as: :project_rfis

  root to: 'pages#home'
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
end
