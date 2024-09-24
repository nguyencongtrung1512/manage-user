import PropTypes from 'prop-types';
import "./index.scss";

function Button({ variant, onClick, children }: { variant: 'default' | 'danger' | 'primary', onClick: () => void, children: React.ReactNode }) {
    return (
        <button onClick={onClick} className={`button button--${variant}`}>
            {children || variant}
        </button>
    );
}

Button.propTypes = {
    variant: PropTypes.oneOf(['default', 'danger', 'primary']),
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
};

Button.defaultProps = {
    variant: 'default',
    children: null,
};

export default Button;
