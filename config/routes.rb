Rails.application.routes.draw do
  get 'pages/home'
  get 'projects/:id/instruments', to: 'projects#project_instruments'
  get 'projects/:id/instruments/metrics', to: 'projects#project_instruments_metrics'
  get 'projects/:id/equipment', to: 'projects#project_equipment'
  get 'projects/:id/equipment/metrics', to: 'projects#project_equipment_metrics'

  root to: 'pages#home'
  resources :rfi_responses
  resources :projects
  resources :information_requests
  resources :instruments
  resources :equipment
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
