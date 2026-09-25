export function QuickActions() {
  return (
    <section className="quick-actions" aria-labelledby="quick-actions-heading">
      <div>
        <h2 id="quick-actions-heading" className="heading-3">
          Quick actions
        </h2>
        <p className="body-text">Wallet actions will be available here soon.</p>
      </div>

      <div className="quick-action-buttons">
        <button className="button" type="button">
          Fund wallet
        </button>
        <button className="button button--secondary" type="button">
          Transfer money
        </button>
      </div>
    </section>
  )
}
