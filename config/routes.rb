Rails.application.routes.draw do
  get 'handvalves/new'

  get 'handvalves/create'

  get 'handvalves/show'

  get 'handvalves/destroy'

  resources :documents
  resources :team_members
  resources :handvalves
  get 'pages/home'
  get 'projects/instruments', to: 'projects#project_instruments', as: :project_instruments
  get 'projects/instruments/metrics', to: 'projects#project_instruments_metrics', as: :project_instruments_metrics
  get 'projects/equipment', to: 'projects#project_equipment', as: :project_equipment
  get 'projects/equipment/metrics', to: 'projects#project_equipment_metrics', as: :project_equipment_metrics
  get 'projects/rfis', to: 'projects#project_rfis', as: :project_rfis
  get 'projects/documents', to: 'projects#project_documents', as: :project_documents
  get 'projects/metrics', to: 'projects#project_metrics', as: :project_metrics
  get 'projects/handvalves', to: 'projects#project_handvalves', as: :project_handvalves
  post 'select_project', to: 'project_sessions#create'

  root to: 'pages#home'
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
  resources :users, controller: :users, only: :create
end
