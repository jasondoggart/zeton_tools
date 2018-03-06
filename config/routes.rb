Rails.application.routes.draw do

  get 'pages/home'
  get 'projects/instruments',
    to: 'projects#project_instruments',
    as: :project_instruments
  get 'projects/instruments/metrics',
    to: 'projects#project_instruments_metrics',
    as: :project_instruments_metrics
  get 'projects/instruments/excel',
    to: 'projects#project_instruments_excel',
    as: :project_instruments_excel
  get 'projects/equipment',
    to: 'projects#project_equipment',
    as: :project_equipment
  get 'projects/equipment/metrics',
    to: 'projects#project_equipment_metrics',
    as: :project_equipment_metrics
  get 'projects/equipment/excel',
    to: 'projects#project_equipment_excel',
    as: :project_equipment_excel
  get 'projects/rfis',
    to: 'projects#project_rfis',
    as: :project_rfis
  get 'projects/metrics',
    to: 'projects#project_metrics',
    as: :project_metrics
  get 'projects/handvalves',
    to: 'projects#project_handvalves',
    as: :project_handvalves
  get 'projects/handvalves/metrics',
    to: 'projects#project_handvalves_metrics',
    as: :project_handvalves_metrics
  get 'projects/handvalves/excel',
    to: 'projects#project_handvalves_excel',
    as: :project_handvalves_excel
  get 'projects/action_items',
    to: 'projects#project_action_items',
    as: :project_action_items
  post 'select_project', to: 'project_sessions#create'

  root to: 'pages#home'
  resources :action_items
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
  resources :users, controller: :users, only: [:create, :show]
  resources :team_members
  resources :handvalves
  resources :client_team_members
  resources :project_instrument_imports
  resources :project_equipment_imports
  resources :project_handvalve_imports
  resources :project_extract_imports
end
